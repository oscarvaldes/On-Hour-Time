
# coding: utf-8

# In[ ]:


from flask import Flask, request, jsonify
from flask_cors import CORS
import json

from icalendar import Calendar, Event, vCalAddress, vText
from datetime import datetime
from dateutil import parser
import pytz

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders

import os


# In[ ]:


MY_ADDRESS = 'OnHourTimeTeam@outlook.com'


# In[ ]:


app = Flask(__name__)
CORS(app)

# In[ ]:


@app.route('/')
def home():
    return 'On Hour Time - Invite API'

@app.route('/initial', methods=['POST']) 
def initial_invite():
    content = dict(request.form)
    print(content);
    name = content["name"][0]
    url = content["url"][0]
    creator = content["creator"][0]
    participants = content['participants'][0].split(',')
    print(name, url, creator, participants)
    return jsonify(send_initial_invite(name, url, participants, creator)), 200
    
@app.route('/final', methods=['POST']) 
def final_invite():
    content = request.json
    return jsonify(send_final_invite(content['name'], content['begin'], content['end'], 
                                     content['location'], content['description'], content['participants'], 
                                     content['creator_name'], content['creator_email'])), 200


# In[ ]:


def create_ics(name, begin, end, description, location, participants, creator_name, creator_email):
    cal = Calendar()
    cal.add('prodid', '-//My calendar product//mxm.dk//')
    cal.add('version', '2.0')
    event = Event()
    event.add('summary', name)
    event.add('description', description)
    event.add('dtstart', parser.parse(begin))
    event.add('dtend', parser.parse(end))
    organizer = vCalAddress('MAILTO:{}'.format(creator_email))
    organizer.params['cn'] = vText(creator_name)
    event['organizer'] = organizer
    event['location'] = vText(location)

    event['uid'] = '9999/333555666@mxm.dk'
    event.add('priority', 5)
    
    for p_email, p_name in participants.items():
        attendee = vCalAddress('MAILTO:{}'.format(p_email))
        attendee.params['cn'] = vText(p_name)
        attendee.params['ROLE'] = vText('REQ-PARTICIPANT')
        event.add('attendee', attendee, encode=0)
    
    cal.add_component(event)
    
    f = open('invite.ics', 'wb')
    f.write(cal.to_ical())
    f.close()

def send_initial_invite(name, url, participants, creator):
    body = '''
    Hey there!
    
    {} Invited you to share your availability for {}. 
    
    Come over to {} and check it out!
    
    
    - From your friends at On Hour Time
    '''
    for p in participants:
        message = MIMEMultipart()
        message['From']= MY_ADDRESS
        message['To']= p
        message['Subject']= name + ' Availability'
        body = body.format(creator, name, url)
        message.attach(MIMEText(body))
        server.send_message(message)
        del message
    return 'Sent initial invite successfully!'

def send_final_invite(name, begin, end, location, description, participants, creator_name, creator_email):
    body= '''
    Hey there again!
    
    We over here at OnHourTime have figured out the best time for your meeting. 
    
    For your convenience, we have attached a calendar file to this email. Just add it to your calendar and that's all! 
    
    
    Thanks for using our service - we hope your meeting is awesome!
    - From your friends at On Hour Time
    '''
    
    create_ics(name, begin, end, description, location, participants, creator_name, creator_email)
    
    part = MIMEBase('application', "octet-stream")
    part.set_payload(open("invite.ics", "rb").read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', 'attachment; filename="invite.ics"')
    
    for p in participants.keys():
        message = MIMEMultipart()
        message['From']= MY_ADDRESS
        message['To']= p
        message['Subject']= name + ' Invite'
        message.attach(MIMEText(body))
        message.attach(part)
        server.send_message(message)
        print('Sent email to {}'.format(p))
        del message
    
    os.remove('invite.ics')
    return 'Sent final invite successfully!'


# In[ ]:


# Start up SMTP
server = smtplib.SMTP(host='smtp.office365.com', port=587)
server.starttls() 
server.login('OnHourTimeTeam@outlook.com', 'CSCI4050')


# In[ ]:


app.run(port=5000)


from flask import Flask

api = Flask(__name__)

@api.route('/profile')
def my_profile():
    response_body = {
        'name': 'beepboodddddp',
        'about': 'beep boop bop'
    }

    return response_body
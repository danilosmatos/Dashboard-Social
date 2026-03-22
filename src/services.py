from flask import Flask, jsonify, request
from flask_cors import CORS
import requests

app = Flask(__name__)
# O CORS é fundamental para que o seu navegador permita que o 
# FrontEnd acesse este backend de uma porta/origem diferente
CORS(app)

JSON_PLACEHOLDER_URL = "https://jsonplaceholder.typicode.com"

@app.route('/users', methods=['GET'])
def get_users():
    response = requests.get(f"{JSON_PLACEHOLDER_URL}/users")
    return jsonify(response.json()), response.status_code

@app.route('/posts', methods=['GET'])
def get_posts():
    # Captura o userId enviado via query string (?userId=1)
    user_id = request.args.get('userId')
    url = f"{JSON_PLACEHOLDER_URL}/posts"
    if user_id:
        url += f"?userId={user_id}"
    
    response = requests.get(url)
    return jsonify(response.json()), response.status_code

@app.route('/posts/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    response = requests.get(f"{JSON_PLACEHOLDER_URL}/posts/{post_id}/comments")
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(debug=True)
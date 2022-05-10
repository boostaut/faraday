# Faraday Penetration Test IDE
# Copyright (C) 2016  Infobyte LLC (http://www.infobytesec.com/)
# See the file 'doc/LICENSE' for the license information

# BEGIN PS6 CODE #

import flask
from flask import Blueprint
from marshmallow import Schema

from faraday import __version__ as f_version
from faraday.server.api.base import GenericView
from faraday.server.config import faraday_server
from faraday.settings.dashboard import DashboardSettings
from flask_security.utils import hash_password
from faraday.server.models import User, db, Role, WorkspacePermission
import string
import random
import json

from faraday.server.utils.database import get_or_create


user_api = Blueprint('user_api', __name__)


class EmptySchema(Schema):
    pass


class UserView(GenericView):
    route_base = 'user'
    schema_class = EmptySchema

    def get(self):
        """
        ---
        get:
          tags: ["Informational"]
          description: get all users
          responses:
            200:
              description: Ok
        """
        args = flask.request.args
        user_list = []
        if args.get("user_id"):
          user_from_id = User.query.filter_by(id=args.get("user_id")).first()
          user_list.append(user_from_id)
        else :
          user_list = User.query.all()
        user_list_json = []
        for user in user_list:
          role_id = 3
          workspaces_id = []
          if user.roles:
            role_id = user.roles[0].id
          if user.workspace_permission_instances:
            for element in user.workspace_permission_instances:
              workspaces_id.append(element.workspace_id)
          user_json = {
            "id":user.id,
            "username": user.username,
            "name": user.name,
            "role_id": role_id,
            "workspaces_id": workspaces_id
          }
          user_list_json.append(user_json)
        list_json = json.dumps(user_list_json)
        response = flask.jsonify(list_json)
        response.status_code = 200

        return response
    get.is_public = True

    def post(self):
        """
        ---
        post:
          tags: ["Informational"]
          description: create a new user
          responses:
            200:
              description: Ok
        """
        # BEGIN create a new user
        try :
          user_json = json.loads(flask.request.data)
        except Exception as e:
          print("unable to load json")
        user = User.query.filter_by(username=user_json['username']).first()
        if user == None:
          try :
            res = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k = 36))
            instance, created = get_or_create(db.session,User, username=user_json['username'],fs_uniquifier=str(res))
            role = Role.query.filter_by(id=user_json['role_id']).first()
            instance.name = user_json['name']
            instance.password = hash_password(user_json['password'])
            instance.roles.append(role)
            if 'workspaces_id' in user_json:
              for ws_id in user_json['workspaces_id']:
                ws_instance, ws_created = get_or_create(db.session, WorkspacePermission, user_id=instance.id, workspace_id=ws_id)
            db.session.commit()
          except Exception as e:
            print("Unable to create a new user, error = ")
            print(e)
        # END create a new user
        
        response = flask.jsonify({'user': 'post'})
        response.status_code = 200

        return response

    post.is_public = True

    def patch(self):
        """
        ---
        patch:
          tags: ["Informational"]
          description: Modify a user
          responses:
            200:
              description: Ok
        """
        try:
          user_json = json.loads(flask.request.data)
        except:
          response = flask.jsonify({'error':'parse json data'})
          response.status_code = 400
          return response
        if 'id' not in user_json:
          response = flask.jsonify({'error':'user id missed'})
          response.status_code = 400
          return response

        user = User.query.filter_by(id=user_json['id']).first()
        if user:
          if 'name' in user_json:
            user.name = user_json['name']
          if 'username' in user_json:
            user.username = user_json['username']
          if 'password' in user_json:
            print("password is in json data")
            user.password =  hash_password(user_json['password'])
          if 'role_id' in user_json:
            role = Role.query.filter_by(id=user_json['role_id']).first()
            user.roles = []
            user.roles.append(role)
          if 'workspaces_id' in user_json:
            user.workspace_permission_instances = []
            if len(user_json['workspaces_id']) > 0:
              for ws_id in user_json['workspaces_id']:
                ws_instance, ws_created = get_or_create(db.session, WorkspacePermission, user_id=user.id, workspace_id=ws_id)
          
          db.session.add(user)
          db.session.commit()
          response = flask.jsonify({'success':'user updated'})
          response.status_code = 200
          return response
          # TODO: updated user role, user_json['role]
        else:
          response = flask.jsonify({'error':'user not exist'})
          response.status = 404
          return response
        response = flask.jsonify({'user': 'patch'})
        response.status_code = 200

        return response

    patch.is_public = True

    def delete(self):
        """
        ---
        delete:
          tags: ["Informational"]
          description: Delete a user
          responses:
            200:
              description: Ok
        """
        try:
          user_id = flask.request.args.get('id')
        except:
          print("argument id missed")
          response = flask.jsonify({'error':'argument id missed'})
          response.status_code = 400
          return response

      
        user = User.query.filter_by(id=user_id).first()
        if user:
          if user.username == 'faraday':
            print("faraday user cannot be deleted")
            response = flask.jsonify({'error':'faraday user cannot be deleted'})
            response.status_code = 406
            return response
          db.session.delete(user)
          db.session.commit()
          print("user deleted")
          response = flask.jsonify({'success':'user deleted'})
          response.status_code = 200
          return response
        else:
          print("user not found")
          response = flask.jsonify({'error':'user not found'})
          response.status_code = 404
          return response

    delete.is_public = True


UserView.register(user_api)

# END PS6 CODE #
# Faraday Penetration Test IDE
# Copyright (C) 2016  Infobyte LLC (http://www.infobytesec.com/)
# See the file 'doc/LICENSE' for the license information

import flask
from flask import Blueprint
from marshmallow import Schema

from faraday import __version__ as f_version
from faraday.server.api.base import GenericView
from faraday.server.config import faraday_server
from faraday.settings.dashboard import DashboardSettings

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
          description: Gives basic info about the faraday service
          responses:
            200:
              description: Ok
        """

        response = flask.jsonify({'user': 'password'})
        response.status_code = 200

        return response

    get.is_public = True


UserView.register(user_api)

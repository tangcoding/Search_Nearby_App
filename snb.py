"""
Search Neighboring Parks

"""

import os
import webapp2
from google.appengine.ext.webapp import template


class MainPage(webapp2.RequestHandler):
  """The main UI page, renders the 'index.html' template."""

  def get(self):
    """Renders the main page"""

  
    template_values = {}

    path = os.path.join(os.path.dirname(__file__), 'index.html')
    self.response.out.write(template.render(path, template_values))

#-------------------------------------------------------------#
#                                                             #
#-------------------------------------------------------------#   

app = webapp2.WSGIApplication([
    ('/', MainPage),
    ],
    debug=True)
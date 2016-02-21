# -*- coding: utf-8 -*-

from __future__ import print_function
from __future__ import with_statement
from __future__ import unicode_literals

from datetime import datetime
from time import time

from time import sleep

class Watcher(object):

  def __init__(self, location='.'):
    self.location = location
    self.leap = 1
    self.pwd = self.__get_pwd()
    self.time = time()

  def __enter__(self):
    return self

  def __exit__(self ,type, value, traceback):
    return False

  def __get_pwd(self):
    from os import environ
    return environ['PWD']

  def __get_time_str(self, utc=False):
    tf = '%Y%m%d-%H:%M:%S.%f'
    return datetime.now().strftime(tf)

  def watch(self):
    while True:
      sleep(self.leap)


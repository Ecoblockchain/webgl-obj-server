# -*- coding: utf-8 -*-

from __future__ import print_function
from __future__ import with_statement
from __future__ import unicode_literals

from sys import stdout

from time import time

from time import sleep

class Watcher(object):

  def __init__(self, location='.'):
    self.location = location
    self.leap = 1
    self.pwd = self.__get_pwd()
    self.time = time()

    self.rsync_cmd = 'rsync --include "*.obj" --include "index.json" --exclude "*" '+\
      '-rave "ssh -i /home/anders/bin/katniss.pem" ' +\
      '. ubuntu@livegen.inconvergent.net:~/models/'

    self.current = set(self.__get_current())
    self.__make_index_json()
    self.__rsync()

  def __enter__(self):
    return self

  def __exit__(self ,type, value, traceback):
    return False

  def __get_pwd(self):
    from os import environ
    return environ['PWD']

  def __get_time_str(self, utc=False):
    from datetime import datetime
    tf = '%Y%m%d-%H:%M:%S.%f'
    return datetime.now().strftime(tf)

  def __get_current(self, postfix='.obj'):
    from glob import glob
    current = glob('*{:s}'.format(postfix))
    return current

  def __compare_update(self, postfix='.obj'):
    current = self.__get_current()
    if set(current) == self.current:
      return True, 0
    else:
      old = len(self.current)
      self.current.update(current)
      return False, len(self.current) - old

  def __msg(self, msg):
    stdout.write('{:s} - {:s}\n'.format(self.__get_time_str(), msg))

  def __make_index_json(self, indent=0):
    from json import dump
    files = sorted(list(self.current))

    jsn = {
      'files': files,
      'recent': files[-1]
    }
    with open('index.json', 'w') as f:
      dump(jsn, f, indent=indent)

  def __rsync(self):

    import subprocess
    self.__msg('rsync:')

    p = subprocess.Popen(
      self.rsync_cmd,
      shell=True,
      stdout=subprocess.PIPE,
      stderr=subprocess.STDOUT
    )
    lines = p.stdout.readlines()
    for l in lines:
      stdout.write('::'+l.strip()+'\n')
    if p.wait()!=0:
      raise RuntimeError(
        'fn: could not sync'
      )

  def watch(self):

    try:
      while True:
        self.__msg('looking')
        same, diff = self.__compare_update()
        if same:
          self.__msg('no change')
        if not same:
          self.__msg('updating index, diff: {:d}'.format(diff))
          self.__make_index_json()
          self.__rsync()

        sleep(self.leap)
    except KeyboardInterrupt:
      pass


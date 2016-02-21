#!/usr/bin/python
# -*- coding: utf-8 -*-

"""wgl-watcher

Usage:
  wgl-watcher
  wgl-watcher -h
  wgl-watcher -v

Examples:

  wgl-watcher  Watch current folder for changes.
  -h           Show this screen.
  -v           Show version.
"""


from __future__ import print_function
from __future__ import with_statement
from __future__ import unicode_literals

__ALL__ = ['Watcher']

from watcher import Watcher


def run():

  from docopt import docopt
  args = docopt(__doc__, version='fn 0.0.1')
  main(args)

def main(args):

  from sys import stderr
  from sys import exit

  print(args)
  try:
    with Watcher() as w:
      w.watch()

  except Exception as e:
    print(e, file=stderr)
    exit(1)


if __name__ == '__main__':
  run()


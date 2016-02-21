#!/usr/bin/python
# -*- coding: utf-8 -*-

try:
  from setuptools import setup
except ImportError:
  from distutils.core import setup

dependencies = [
  'docopt'
]

setup(
  name='watcher',
  version='0.0.1',
  description='watcher',
  url='',
  license='MIT License',
  author='Anders Hoff',
  author_email='inconvergent@gmail.com',
  install_requires=dependencies,
  packages=[
    'watcher'
  ],
  entry_points={
    'console_scripts': [
      'wgl-watcher=watcher:run'
    ]
  },
  zip_safe=True
)


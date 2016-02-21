#!/bin/bash

here=`pwd`
root=$here/../

sudo rm -rf /etc/nginx/sites-enabled/default
sudo ln -s $root/conf/nginx.conf /etc/nginx/sites-enabled/default

sudo rm -rf /usr/share/nginx/www
sudo mkdir -p /usr/share/nginx/www
sudo cp $root/www/* /usr/share/nginx/www -r

sudo rm -rf /usr/share/nginx/www/models
mkdir -p $here/../../models
sudo chmod 755 $here/../../models
sudo ln -s $here/../../models /usr/share/nginx/www/models

cd $here


FROM ubuntu:16.04

# Install dependencies
RUN apt-get update -y
RUN apt-get install -y git curl apache2 php libapache2-mod-php php-mcrypt php-mysql

# Install app
RUN rm -rf /var/www/*
ADD www /var/www

RUN a2enmod rewrite
ADD apache-config.conf /etc/apache2/sites-enabled/000-default.conf

EXPOSE  80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]
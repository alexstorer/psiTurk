# You should not need to change anything below this!
sudo apt-get install git
sudo apt-get install python-setuptools
sudo apt-get install python-pip
sudo apt-get install mysql-server
sudo apt-get install build-essential python-dev libmysqlclient-dev
sudo apt-get install ec2-api-tools
sudo apt-get install gunicorn
sudo pip install Flask-SQLAlchemy
sudo pip install boto
sudo pip install mysql-python
sudo pip install mysql_connector_python
sudo pip install config
git clone https://github.com/alexstorer/psiTurk.git

# Edit the config files based on what's above
# Maybe use sed?



# Do we need Amazon tools?

#cp /etc/apt/sources.list /home/ubuntu/sources.list
#python psiTurk/addRepos.py
#sudo mv /home/ubuntu/newsources.list /etc/apt/sources.list
#sudo apt-get update
#sudo apt-get install ec2-api-tools

# Permission the database
mysql -u root -p -e "show databases; GRANT ALL PRIVILEGES ON *.* TO 'ubuntu'@'localhost'; GRANT ALL PRIVILEGES ON *.* TO ''@'localhost'; GRANT ALL PRIVILEGES ON *.* TO 'ubuntu'@'%';CREATE DATABASE mturk; show databases"

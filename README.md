Amazon Quick Start
==================
Follow these instructions to set up this code on Amazon's EC2.

1.  Make an Amazon Web Services Account
    *  Sign up here: https://portal.aws.amazon.com/gp/aws/developer/registration/index.html

2.  Make an EC2 Instance
    1. Go to the Amazon EC2 Portal: https://console.aws.amazon.com/ec2
    2. Click "Launch Instance"
    3. Click "Continue" to use the Classic Wizard
    4. Select the Ubuntu Server 13.04 64 bit instance.  This is available for the Free Tier for beginning EC2 users.
    5. Click "Continue" to launch the instance with the default availability zone and instance size.
    6. Click "Continue" to accept the default advanced instance options.
    7. Click "Continue" to accept the default Storage Device Configuration
    8. Add a tag called Name (this is already filled in) with the Value "PsiTurk" (or anything else you can recognize)
    9. Click on "Create a new Key Pair" and enter a name.
	* Click on Create and Download your key pair
	* Click Continue
   10. Click on "Create a new Security Group"
	* Click on the dropbox to create a new rule and select MYSQL. Click Add Rule.
	* Create a Custom TCP rule with port range 5000-6000. Click Add Rule.
	* Create a SSH rule.
	* Click Continue
   11. Click "Launch", then Click "Close"
   12. Your instance will now be running!  Click on "PsiTurk" (or whatever you called your instance) and write down its IP address.  This will look something like `ec2-23-21-28-85.compute-1.amazonaws.com`
3.  SSH to your Amazon Instance.
    * *Note:* The username for this instance will be `ubuntu`
    * Windows users, please use these instructions: http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html
    * Mac users, open a Terminal and type the following:
	* `chmod 700 ~/Downloads/<your key name>.pem`
	* `ssh -i ~/Downloads/<your key name>.pem ubuntu@<your-ip-address>`
	* *Note:* My key is saved in the `~/Downloads` folder - yours may be somewhere else!
4.  Install git on your server by typing the following.
    * `sudo apt-get install git`
5.  Get the code for the experiment
    * `git clone https://github.com/alexstorer/psiTurk.git`
    * Enter the directory by typing `cd psiTurk`
6.  Install the required software dependencies and setup by typing
    * `sh < setup.sh`
7.  Change the configuration files
    Your configuration file is stored as `config.txt` in the `psiTurk` directory on amazon.  You need to edit this file!  You should be able to use a program like WinSCP (on Windows) or Cyberduck (on Mac) to transfer these files to your desktop, edit them, and then transfer them back to Amazon.
    You must change a number of these items in order to start the experiment and post it to MTurk:
    * AWS Access Keys
    * HIT Configuration
    * Server Parameters
8.  Change the template html files
    These files live in a folder called `templates`, and contain the text for the consent form, the instructions, and so on.  Make sure they contain the relevant information for your experiment.
9.  Start the experiment!
    You need to publish your experiment to MTurk, and then to start the web server that is hosting the experiment.
    After using ssh to connect to the Amazon server, type the following:
    * `cd ~/psiTurk; python mturk/createHIT.py`
    * `screen -S exp`
<<<<<<< Updated upstream
    * `sh < run_gunicorn.sh`
=======
    * Change the url in `startexp`
    * `sh startexp`
>>>>>>> Stashed changes
10. Stop the experiment.
    * In order to stop the experiment, you need to ssh to the Amazon server and type the following:
    * `screen -r exp`
    * Press control and c at the same time

How to make changes
===================
To make changes to the experiment the file to change is located in:

`psiTurk/static/task.js`

If you change this file, it will change the experiment.  Your browser will wish to cache this file on your computer, however, so if you visit the experiment from the same browser, you will need to change the version of the javascript file so that it will loaded from scratch when the HTML file is loaded.  This file is located in:

`psiTurk/templates/exp.html`

The reference to `static/task.js` must be changed to, e.g., `static/task.js?v=1.01` - each time you change the javascipt file, you must change this reference so that the file will be loaded anew.

How to get your data
====================    
To download your data, you need to open your experiment in a web browser:

If the address of your study is `ec2-23-21-28-85.compute-1.amazonaws.com`, then direct your browser to:

`ec2-23-21-28-85.compute-1.amazonaws.com/dumpdata`


What is this?
============

PsiTurk is an open platform for conducting custom behvioral experiments on
Amazon's Mechanical Turk. 

It is intended to provide most of the backend machinery necessary to run your
experiment. It uses AMT's _External Question_ HIT type, meaning that you can
collect data using any website. As long as you can turn your experiment into a
website, you can run it with PsiTurk!

You can direct questions to our [Q&A Google group](https://groups.google.com/d/forum/psiturk).

Dependencies
============

You will need to use a relatively recent version of [Python
2](http://python.org) with the following modules installed:

 * [Flask](http://flask.pocoo.org/) – A lightweight web framework.
 * [SQLAlchemy](http://www.sqlalchemy.org/) – A powerful SQL abstraction layer.
 * [Boto](https://github.com/boto/boto) – A library for interfacing with
   Amazon services, including MTurk.
 
You can install these with the following commands:

    easy_install Flask-SQLAlchemy
    easy_install boto

To serve your experiment to participants online, you will need to run this code
from a web server connected to the internet.

Quick Start
===========

Just follow these directions to get started:

1. Check out this repository in git, or download the whole thing using the
   'ZIP' button near the top of this page.
2. Install the dependencies. 
3. Sign up for an AWS account, available [here](http://aws.amazon.com/).
4. Sign up for a Mechanical Turk requester account, available
   [here](https://requester.mturk.com/).
5. Rename the config file from `config.txt.example` to `config.txt`. Update it
   with your secret AWS code.
6. Making sure that the configuration file is set up to use the Amazon sandbox,
   issue the following commands from the PsiTurk root folder:

        python mturk/createHIT.py    # To post a HIT to the sandbox
        python app.py                # To start the debugging server

7. You should be ready to go! Point your browser to the [worker
   sandbox](https://workersandbox.mturk.com/mturk/findhits) and try to find your
   HIT.

*Note*: If you are just testing the server without posting your HIT to Amazon,
you can see the experiment at the following link:
http://localhost:5001/mturk?assignmentId=debug&hitId=debug&workerId=debug


Experiment design
=================

We have provided an example stroop experiment that could form the basis of your
own experiment. It is a Javascript experiment, with task logic inside the
participant's browser using Javascript code in `static/task.js`. This
Javascript code works by dynamically changing the html document served to
participants in `templates/exp.html`. PsiTurk assigns a condition and
counterbalance to each participant. These are fed into JavaScript by plugging
them into `templates/exp.html`. PsiTurk actively manages the condition and
counterbalance subjects are assigned to, helping you fill them in evenly. To
tell PsiTurk how many conditions and counterbalance identities are possible in
your experiment, adust `num_conds` and `num_counters` in `config.txt`.

Deployment
==========

Configuration
------------
To make your experiment available on the internet, you will need to make the
following changes to the configuration file:

    host: 0.0.0.0
    question_url: http://yoururl:yourport/mturk

replacing `yoururl` with the url to your surver, and `yourport` with the port
you have configured in `config.txt` (by default, 5001).


Server
------
We **strongly** recommend you not deploy your experiment using the debugging
server (the one you start using `python app.py`). It is not robust to failures,
which can leave your participants stranded without a way of submitting their
completed HITs. Additionally, if you accidentally leave debug mode on, you will
expose yourself to major security holes.

An alternative we have set up is gunicorn. You can install gunicorn using the
following command:

    easy_install gunicorn

Then simply run using:

    sh run_gunicorn.sh

You can configure gunicorn in `config.txt` under `Server Parameters`.

Flask apps like PsiTurk can be deployed as a CGI, fastCGI, or WSGI app on any
server system, so there are many alternative options for deployment.
Additional options for deploying Flask can be found
[here](http://flask.pocoo.org/docs/deploying/).

Database
--------

We recommend using a deployment-robust database solution such as
[MySQL](http://www.mysql.org) or [PostgreSQL](http://www.postgresql.org).
SQLite does not allow concurrent access to the database, so if the locks work
properly, simultaneous access (say, from multiple users submitting their data
at the same time) could destabilize your database. In the worst (unlikely)
scenario, the database could become corrupted, resulting in data loss.

Instructions for setting up a MySQL server on a Mac can be found 
[in the wiki](https://github.com/NYUCCL/psiTurk/wiki/Macintosh-Configuration).
Other platforms, check out instructions at
[mysql.org](http://dev.mysql.com/doc/refman/5.5/en//installing.html).

Copyright
=========
You are welcome to use this code for personal or academic uses. If you fork,
please cite the authors (Todd Gureckis and John McDonnell).




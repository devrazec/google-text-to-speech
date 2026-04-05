# google-text-to-speech
Google Cloud Text-to-Speech in Node.js

npm init -y
npm i @google-cloud/text-to-speech

gcloud init

gcloud config set project text-to-speech-471620

gcloud services enable cloudresourcemanager.googleapis.com iam.googleapis.com

export GOOGLE_APPLICATION_CREDENTIALS="json/text_to_speech_keys.json"

gcloud auth activate-service-account --key-file=json/text_to_speech_keys.json

https://console.cloud.google.com/home/dashboard?project=text-to-speech-471620

-- Update Python
brew upgrade python
brew install python
brew install python-tk@3.13
brew link --overwrite python@3.13
brew unlink python@3.13 && brew link python@3.13
python3 --version

-- Set Env
ls /usr/local/opt/python@3.13/libexec/bin/python3
export CLOUDSDK_PYTHON=/usr/local/opt/python@3.13/libexec/bin/python3
source ~/.zshrc

-- Check all Python
which python3
brew list | grep python
uname -m

-- Install gcloud
brew install --cask google-cloud-sdk

-- Start and Authenticate Google Cloud
gcloud init
[1] devrazec@gmail.com
[7] text-to-speech-471620
export GOOGLE_APPLICATION_CREDENTIALS="keys/text_to_speech_keys.json"
gcloud auth activate-service-account --key-file=keys/text_to_speech_keys.json

-- Run the script
npm run fluentor

-- Uninstall
brew uninstall --cask google-cloud-sdk
rm -rf /usr/local/share/google-cloud-sdk
rm -rf ~/.config/gcloud
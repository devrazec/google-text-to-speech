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

To run the script
gcloud init
[1] devrazec@gmail.com
[6] text-to-speech-471620
export GOOGLE_APPLICATION_CREDENTIALS="json/text_to_speech_keys.json"
gcloud auth activate-service-account --key-file=json/text_to_speech_keys.json
npm start
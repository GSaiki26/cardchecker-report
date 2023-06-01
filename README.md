# Cardchecker Report

The cardchecker report is an application from the Cardchecker family (check the others cardchecker repos into my account). It's reponsible to send via nodemailer a report about the current month from all the stored checks in cardchecker api.

## Deploy

In order to run this application, you need also theese project properly running:

- [Cardchecker-Api](https://github.com/GSaiki26/cardchecker-api);
- [Worker-Api](https://github.com/GSaiki26/worker-api);
- SSL Certificates used by the above applications.

And theese requirements:

- Docker.

To run, just run this command in a machine with Docker installed:

```sh
docker built -t cardchecker-report .;
docker run --env-file ./report.env -v ${pwd}/certs:/app/certs -t cardchecker-report cardchecker-report;
```

# gemini-dca

Personal automation scheduled logic to perform DCA into Gemini CEX

[Link](https://docs.google.com/document/d/1jUYHuTD6vl7BIbh2C48RT9o6VYQupZ8BEPhZ4oCTtVs/edit?usp=sharing) to Design Document

## Setup

- [ ] Populate `sandbox.env` or `production.env` (depending on environment)
- [ ] Migrate table locally
  - [ ] Run docker and run command `docker-compose up`
  - [ ] Run `source sandbox.env && npx sequelize-cli db:migrate`
- (If you want to remove the entire database functional group, comment and remove the relevant lines of code/files)

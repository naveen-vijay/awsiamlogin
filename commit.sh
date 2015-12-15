#!/usr/bin/env bash
export AWS_DEFAULT_PROFILE=navcode
aws s3 sync . s3://www.awsiamlogin.com --acl public-read
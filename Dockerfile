# Copyright Contributors to the Open Cluster Management project

FROM registry.access.redhat.com/ubi8/nodejs-14:1 as builder

USER root
RUN yum install git python2 -y

ENV USER_UID=1001
USER ${USER_UID}

RUN mkdir -p /opt/app-root/src/grc-ui
WORKDIR /opt/app-root/src/grc-ui

COPY . .

RUN make install
RUN make build-prod
RUN make prune

FROM registry.access.redhat.com/ubi8/nodejs-14:1
USER root
RUN yum -y remove nodejs-nodemon
RUN yum -y update

ENV USER_UID=1001
USER ${USER_UID}

RUN mkdir -p /opt/app-root/src/grc-ui
WORKDIR /opt/app-root/src/grc-ui

COPY --from=builder /opt/app-root/src/grc-ui /opt/app-root/src/grc-ui

ENV BABEL_DISABLE_CACHE=1 \
    NODE_ENV=production 

EXPOSE 3000

CMD ["node", "app.js"]

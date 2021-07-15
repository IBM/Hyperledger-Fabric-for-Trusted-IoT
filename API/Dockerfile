FROM registry.access.redhat.com/ubi8:8.4 as build
LABEL stage=builder

RUN  dnf module install --nodocs -y nodejs:14 python39 --setopt=install_weak_deps=0 --disableplugin=subscription-manager \
    && dnf install --nodocs -y git make gcc gcc-c++  --setopt=install_weak_deps=0 --disableplugin=subscription-manager \
    && dnf clean all --disableplugin=subscription-manager

RUN mkdir /app
COPY . /app
WORKDIR /app
RUN npm install --no-audit --no-update-notifier --no-fund --production

## Release image
FROM registry.access.redhat.com/ubi8/nodejs-14-minimal:1

COPY --from=build /app /app

WORKDIR /app

EXPOSE 3000

CMD ["node", "index.js"]

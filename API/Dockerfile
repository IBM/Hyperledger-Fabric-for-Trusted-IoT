FROM registry.access.redhat.com/ubi8:8.6 as build
LABEL stage=builder

RUN  dnf module install --nodocs -y nodejs:16 python39 --setopt=install_weak_deps=0 --disableplugin=subscription-manager \
    && dnf install --nodocs -y git make gcc gcc-c++  --setopt=install_weak_deps=0 --disableplugin=subscription-manager \
    && dnf clean all --disableplugin=subscription-manager

RUN mkdir /app
COPY . /app
WORKDIR /app
# Prevent "npm ERR! code ERR_SOCKET_TIMEOUT" by upgrading from npm 8.3 to >= npm 8.5.1
RUN npm install --no-audit --no-update-notifier --no-fund --production -g npm@8.12.2
RUN npm install --no-audit --no-update-notifier --no-fund --omit=dev

## Release image
FROM registry.access.redhat.com/ubi8/nodejs-16-minimal:1

USER 0
RUN microdnf update -y --nodocs && \
    microdnf clean all && \
    rm -rf /mnt/rootfs/var/cache/* /mnt/rootfs/var/log/dnf* /mnt/rootfs/var/log/yum.*
USER 1001

COPY --from=build /app /app

WORKDIR /app

EXPOSE 3000

CMD ["node", "index.js"]

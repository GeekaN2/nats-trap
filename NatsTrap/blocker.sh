#!/bin/bash

if [[ $1 == "-h" || $1 == "--help" ]]; then
  echo "Usage: $0 <ip> <action>"
  echo "Block, accept or unblock NATS connections from IP address."
  echo "  <ip>          IP address to block, accept or unblock NATS connections from."
  echo "  <action>      Action to perform: block, accept, or unblock."
fi

# Проверяем, что переданы два аргумента
if [ $# -ne 2 ]; then
  echo "Usage: $0 <ip> <action>"
  exit 1
fi

IP=$1
ACTION=$2

case $ACTION in
  block)
    # Добавляем правило в iptables для блокировки NATS-соединений от указанного IP
    iptables -I DOCKER-USER -s $IP -i eth0 -p tcp -m multiport --dports 4222,6222,8222 -j DROP
    echo "iptables rule added to block NATS connections from IP $IP"
    ;;
  accept)
    # Разрешаем все пакеты от указанного IP
    iptables -I DOCKER-USER -s $IP -j ACCEPT
    echo "iptables rule added to accept all packets from IP $IP"
    ;;
  unblock)
    # Удаляем правило iptables для блокировки NATS-соединений от указанного IP
    iptables -D DOCKER-USER -s $IP -i eth0 -p tcp -m multiport --dports 4222,6222,8222 -j DROP
    echo "iptables rule removed to unblock NATS connections from IP $IP"
    ;;
  *)
    echo "Invalid action: $ACTION (valid values are block, accept, or unblock)"
    exit 1
    ;;
esac
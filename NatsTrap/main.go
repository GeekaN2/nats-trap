package main

import (
	"fmt"

	"github.com/nats-io/nats-server/v2/server"
)

type MyAuth struct{}

func (a *MyAuth) Check(c server.User) bool {
	// выводим сообщение в консоль при подключении клиента
	fmt.Printf("Client connected: %s\n", c.Username)
	return true
}

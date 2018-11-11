package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"

	"github.com/urfave/cli"
)

var (
	baseURL = "http://localhost:4000"
)

func request(method, path string, params interface{}) error {
	data, _ := json.Marshal(params)
	r, err := http.NewRequest(method, baseURL+path, bytes.NewReader(data))
	if err != nil {
		return err
	}
	r.Header.Set("content-type", "application/json")
	res, err := http.DefaultClient.Do(r)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode != 200 {
		data, _ := ioutil.ReadAll(res.Body)
		return fmt.Errorf("status(%d): %s", res.StatusCode, data)
	}
	return nil
}

func main() {
	app := cli.NewApp()
	app.Name = "navigatorctl"
	app.Usage = "Navigator control"

	app.Commands = []cli.Command{
		{
			Name:  "apply",
			Usage: "apply an app manifest",
			Action: func(c *cli.Context) error {
				data, err := ioutil.ReadFile(c.Args().First())
				if err != nil {
					return err
				}
				m := map[string]interface{}{}
				err = json.Unmarshal(data, &m)
				if err != nil {
					return err
				}
				return request("POST", "/api/v1/apps", m)
			},
		},
		{
			Name:  "build",
			Usage: "push a build into the app",
			Flags: []cli.Flag{
				cli.StringFlag{Name: "app"},
				cli.StringFlag{Name: "stage"},
				cli.StringFlag{Name: "version"},
			},
			Action: func(c *cli.Context) error {
				return request("POST", "/api/v1/build", map[string]string{
					"app":     c.String("app"),
					"stage":   c.String("stage"),
					"version": c.String("version"),
				})
			},
		},
		{
			Name:  "release",
			Usage: "release a build",
			Flags: []cli.Flag{
				cli.StringFlag{Name: "app"},
				cli.StringFlag{Name: "stage"},
				cli.StringFlag{Name: "version"},
			},
			Action: func(c *cli.Context) error {
				return request("POST", "/api/v1/release", map[string]string{
					"app":     c.String("app"),
					"stage":   c.String("stage"),
					"version": c.String("version"),
				})
			},
		},
		{
			Name:  "remove",
			Usage: "removes a build",
			Flags: []cli.Flag{
				cli.StringFlag{Name: "app"},
				cli.StringFlag{Name: "stage"},
				cli.StringFlag{Name: "version"},
			},
			Action: func(c *cli.Context) error {
				return request("DELETE", "/api/v1/release", map[string]string{
					"app":     c.String("app"),
					"stage":   c.String("stage"),
					"version": c.String("version"),
				})
			},
		},
		{
			Name:  "promote",
			Usage: "promote a build",
			Flags: []cli.Flag{
				cli.StringFlag{Name: "app"},
				cli.StringFlag{Name: "stage"},
				cli.StringFlag{Name: "version"},
				cli.StringFlag{Name: "to"},
			},
			Action: func(c *cli.Context) error {
				return request("POST", "/api/v1/promote", map[string]string{
					"app":     c.String("app"),
					"stage":   c.String("stage"),
					"version": c.String("version"),
					"to":      c.String("to"),
				})
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%v", err)
		os.Exit(1)
	}
}

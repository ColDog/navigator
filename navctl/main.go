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

const version = "0.0.1"

func request(c *cli.Context, method, path string, params interface{}) error {
	baseURL := c.GlobalString("api-url")
	key := c.GlobalString("api-key")

	data, _ := json.Marshal(params)
	r, err := http.NewRequest(method, baseURL+path, bytes.NewReader(data))
	if err != nil {
		return err
	}
	r.Header.Set("authorization", "Bearer "+key)
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

var build = cli.Command{
	Name:  "build",
	Usage: "Create a build to deploy.",
	UsageText: `
Register a build with the navigator server, usually called from CI environments with different parameters depending on the branch and build status.

Examples:
  # Register a staging build using the commit as the current version in CI:
  navctl build --app test --stage staging --version ${GIT_COMMIT:0:7}

  # Register a review build with a pr namespace:
  navctl build -a test -s review -v ${GIT_COMMIT:0:7} -n ${PR_ID}

  # Register a build with a chart url:
  navctl build -a test -s staging -v ${GIT_COMMIT:0:7} -c github.com/hashicorp/go-getter?ref=${GIT_COMMIT}
`,
	Flags: []cli.Flag{
		cli.StringFlag{Name: "app, a", Usage: "application name (required)"},
		cli.StringFlag{Name: "namespace, n", Usage: "namespace to deploy into (required for review environments)"},
		cli.StringFlag{Name: "chart, c", Usage: "chart path for this build follows go-getter syntax"},
		cli.StringFlag{Name: "stage, s", Usage: "application stage (required)"},
		cli.StringFlag{Name: "version, v", Usage: "application version (required)"},
		cli.StringFlag{Name: "values, l", Usage: "json formatted values", Value: "{}"},
	},
	Action: func(c *cli.Context) error {
		return request(c, "POST", "/api/v1/build", map[string]interface{}{
			"app":       c.String("app"),
			"stage":     c.String("stage"),
			"namespace": c.String("namespace"),
			"version":   c.String("version"),
			"chart":     c.String("chart"),
			"values":    json.RawMessage(c.String("values")),
		})
	},
}

var apply = cli.Command{
	Name:  "apply",
	Usage: "Apply an application manifest to the server.",
	UsageText: `
Apply an application manifest, call this when your application manifests change.

Examples:
  navctl apply ./config/manifest.json
`,
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
		return request(c, "POST", "/api/v1/apps", m)
	},
}

func main() {
	app := cli.NewApp()
	app.Flags = []cli.Flag{
		cli.StringFlag{Name: "api-key, k", Usage: "navigator api key", EnvVar: "API_KEY"},
		cli.StringFlag{Name: "api-url, u", Usage: "navigator api url", EnvVar: "API_URL", Value: "http://localhost:4000"},
	}
	app.Version = version
	app.Name = "navctl"
	app.Commands = []cli.Command{apply, build}

	err := app.Run(os.Args)
	if err != nil {
		fmt.Fprintf(os.Stderr, "%v\n", err)
		os.Exit(1)
	}
}

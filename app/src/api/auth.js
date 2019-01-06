import { register } from "./fetch";
import * as router from "../router";

register(res => {
  if (res.status === 401) {
    router.go("/login");
  }
});

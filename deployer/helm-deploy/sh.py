import subprocess

ProcessError = subprocess.CalledProcessError


def sh(*cmd, write=None, quiet=False, quiet_stderr=False, capture=False, verbose=False):
    if verbose:
        print("$", *cmd)

    p = None
    try:
        kwargs = {}
        if quiet_stderr:
            kwargs["stderr"] = subprocess.PIPE
        if quiet or capture:
            kwargs["stdout"] = subprocess.PIPE
        if write:
            kwargs["stdin"] = subprocess.PIPE
        p = subprocess.Popen(cmd, **kwargs)
        out = None
        if capture or write:
            out = p.communicate(input=write)[0]
        p.wait()
        if p.returncode != 0:
            raise subprocess.CalledProcessError(p.returncode, cmd, output=out)
        return out
    finally:
        if p:
            p.kill()

import os
import sys
import time
import select

def run_deploy():
    pid, fd = os.forkpty()
    
    if pid == 0:
        # We are in the child process
        cmd = ["npx", "shopify", "hydrogen", "deploy", "--shop", "ueicbp-za.myshopify.com", "--env", "production", "--force"]
        os.chdir("/Users/curt/Desktop/CSA /Clients/ShowerHaus/showerhaus-dev")
        try:
            os.execvp(cmd[0], cmd)
        except Exception as e:
            sys.stderr.write(f"Exec failed: {e}\n")
            sys.exit(1)
    else:
        # We are in the parent process
        buffer = b""
        confirmed = False
        
        while True:
            r, w, x = select.select([fd], [], [], 0.5)
            if fd in r:
                try:
                    data = os.read(fd, 1024)
                except OSError:
                    break
                if not data:
                    break
                
                # Write to stdout
                sys.stdout.buffer.write(data)
                sys.stdout.flush()
                
                buffer += data
                if b"Continue?" in buffer and not confirmed:
                    # Let the prompt render completely
                    time.sleep(1.5)
                    # Write 'y' to select Yes
                    os.write(fd, b"y")
                    confirmed = True
                    buffer = b""
            
            # Check if child process exited
            try:
                child_pid, status = os.waitpid(pid, os.WNOHANG)
                if child_pid != 0:
                    break
            except ChildProcessError:
                break
                
        # Read any remaining output
        while True:
            r, w, x = select.select([fd], [], [], 0.1)
            if fd in r:
                try:
                    data = os.read(fd, 1024)
                except OSError:
                    break
                if not data:
                    break
                sys.stdout.buffer.write(data)
                sys.stdout.flush()
            else:
                break

if __name__ == "__main__":
    run_deploy()

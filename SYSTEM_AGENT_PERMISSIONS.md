 **No system-level operations**

**Configuration**: Already set up with `GRANT_ALL_PERMISSIONS=true`

### 2. Pinokio Script Agent (System-Level)

**Permission Level**: Full System Access  
**Capabilities**:
- ✅ Execute any syste# Agents with Full System Permissions

## Overview

This document explains the different types of agents and their permission levels, from browser-only to full system access.

## Agent Types & Permission Levels

### 1. Browser Agent (Current - Browser-Use)

**Permission Level**: Browser-Only  
**Capabilities**:
- ✅ Full browser permissions (camera, microphone, geolocation, etc.)
- ✅ Web page interaction and automation
- ✅ File downloads/uploads through browser
- ✅ Clipboard access (read/write)
- ✅ Browser storage (localStorage, IndexedDB)
- ❌ **No direct system command execution**
- ❌ **No file system access outside browser**
- ❌m command via `shell.run`
- ✅ File system operations (read, write, copy, delete)
- ✅ Network operations
- ✅ Process management
- ✅ Environment variable access
- ✅ Cross-platform commands (Windows, Linux, macOS)
- ✅ Package manager access (npm, pip, conda, etc.)

**How It Works**: Pinokio scripts run with the same permissions as the user running Pinokio.

### 3. Hybrid Agent (Browser + System)

**Permission Level**: Browser + System  
**Capabilities**: Combines both browser and system access

## Creating a Full System Permission Agent

### Option 1: Extend Browser Agent with System Tools
t combines browser automation with system command execution:

```python
# app/src/agent/system_browser_agent.py
import subprocess
import os
from browser_use.agent.service import Agent

class SystemBrowserAgent(Agent):
    """Agent with both browser and system permissions"""
    
    async def execute_system_command(self, command: str) -> str:
        """Execute system command and return output"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=30
            )
            return result.stdout + result.stderr
        except Exception as e:
            return f"Error: {str(e)}"
    
    async def read_file(self, path: str) -> str:
        """Read file from filesystem"""
        with open(path, 'r') as f:
            return f.read()
    
    async def write_file(self, path: str, content: str):
        """Write file to filesystem"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w') as f:
            f.write(content)
```

### Option 2: Use Pinokio Scripts for System Operations

Create Pinokio scripts that the browser agent can trigger:

```javascript
// system_command.js
module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "{{args.command}}"
        ],
        sudo: "{{args.sudo || false}}"
      }
    },
    {
      method: "script.return",
      params: {
        output: "{{input}}"
      }
    }
  ]
}
```

Create a custom agent tha
### Option 3: MCP (Model Context Protocol) Integration

Use MCP servers to provide system access:

```python
# Connect to MCP server for system operations
from src.utils.mcp_client import MCPClient

mcp_client = MCPClient()
system_result = await mcp_client.call_tool("execute_command", {"command": "ls -la"})
```

## Full System Permission Configuration

### Environment Variables for System Access

Add to `app/.env`:

```bash
# Enable system command execution
ENABLE_SYSTEM_COMMANDS=true

# Allow sudo/administrator commands (use with caution)
ALLOW_SUDO_COMMANDS=false

# System command timeout (seconds)
SYSTEM_COMMAND_TIMEOUT=30

# Allowed command prefixes (security)
ALLOWED_COMMAND_PREFIXES=python,node,npm,pip,uv,git,curl,wget

# Blocked commands (security)
BLOCKED_COMMANDS=rm -rf,format,del /f,shutdown,reboot
```

### Browser Agent with System Tools

Update the browser agent to include system operation tools:

```python
# app/src/agent/browser_use/browser_use_agent.py
# Add system tools to agent capabilities

SYSTEM_TOOLS = [
    {
        "name": "execute_command",
        "description": "Execute a system command",
        "parameters": {
            "command": {"type": "string", "description": "Command to execute"},
            "timeout": {"type": "number", "default": 30}
        }
    },
    {
        "name": "read_file",
        "description": "Read a file from the filesystem",
        "parameters": {
            "path": {"type": "string", "description": "File path to read"}
        }
    },
    {
        "name": "write_file",
        "description": "Write content to a file",
        "parameters": {
            "path": {"type": "string", "description": "File path"},
            "content": {"type": "string", "description": "File content"}
        }
    },
    {
        "name": "list_directory",
        "description": "List files in a directory",
        "parameters": {
            "path": {"type": "string", "description": "Directory path"}
        }
    }
]
```

## Security Considerations

### ⚠️ WARNING: Full System Access Risks

Granting full system permissions means the agent can:
- Delete files and folders
- Modify system settings
- Install/uninstall software
- Access sensitive data
- Execute malicious code
- Compromise system security

### Recommended Security Measures

1. **Command Whitelisting**: Only allow specific commands
2. **Path Restrictions**: Limit file access to specific directories
3. **User Permissions**: Run with limited user account (not root/admin)
4. **Sandboxing**: Use containers or VMs for untrusted agents
5. **Audit Logging**: Log all system operations
6. **Approval Workflow**: Require confirmation for dangerous operations

### Safe Configuration Example

```python
# Safe system agent configuration
SAFE_SYSTEM_CONFIG = {
    "allowed_commands": [
        "python", "node", "npm", "pip", "git",
        "ls", "cat", "echo", "mkdir", "cp"
    ],
    "blocked_commands": [
        "rm", "del", "format", "shutdown", "reboot",
        "sudo", "su", "chmod +x"
    ],
    "allowed_paths": [
        "./tmp/",
        "./cache/",
        "./drive/"
    ],
    "blocked_paths": [
        "/etc/",
        "/sys/",
        "/proc/",
        "C:\\Windows\\"
    ],
    "require_approval": [
        "delete", "remove", "uninstall", "format"
    ]
}
```

## Implementation Steps

### Step 1: Create System Tools Module

```python
# app/src/utils/system_tools.py
import subprocess
import os
import logging

logger = logging.getLogger(__name__)

class SystemTools:
    def __init__(self, config=None):
        self.config = config or {}
        self.allowed_commands = self.config.get("allowed_commands", [])
        self.blocked_commands = self.config.get("blocked_commands", [])
    
    def is_command_allowed(self, command: str) -> bool:
        """Check if command is allowed"""
        # Check blocked commands first
        for blocked in self.blocked_commands:
            if blocked in command:
                return False
        
        # Check allowed commands
        if self.allowed_commands:
            return any(cmd in command for cmd in self.allowed_commands)
        
        return True
    
    async def execute(self, command: str, timeout: int = 30) -> dict:
        """Execute system command safely"""
        if not self.is_command_allowed(command):
            return {
                "success": False,
                "error": f"Command not allowed: {command}"
            }
        
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=timeout
            )
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode
            }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "error": f"Command timed out after {timeout}s"
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }
```

### Step 2: Integrate with Browser Agent

```python
# app/src/agent/browser_use/browser_use_agent.py
from src.utils.system_tools import SystemTools

class BrowserUseAgent(Agent):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.system_tools = SystemTools() if os.getenv("ENABLE_SYSTEM_COMMANDS") == "true" else None
```

### Step 3: Add System Tools to Agent Capabilities

The agent will automatically have access to system tools when `ENABLE_SYSTEM_COMMANDS=true` is set.

## Testing System Permissions

### Test Browser Permissions

```python
# Test that browser permissions are granted
await page.goto("https://example.com")
# Permissions should be automatically granted
```

### Test System Permissions

```python
# Test system command execution
result = await system_tools.execute("python --version")
assert result["success"] == True
```

## Current Status

✅ **Browser Permissions**: Fully configured and working  
- All 19 browser permissions automatically granted
- `GRANT_ALL_PERMISSIONS=true` in `.env`

❌ **System Permissions**: Not yet implemented  
- Requires additional code to enable
- Security considerations needed
- Can be added on request

## Next Steps

To enable full system permissions:

1. **Review security requirements** - Understand the risks
2. **Configure allowed commands** - Set up whitelist/blacklist
3. **Implement system tools module** - Add the code above
4. **Test in safe environment** - Verify before production use
5. **Enable in .env** - Set `ENABLE_SYSTEM_COMMANDS=true`

## Summary

- **Browser Agent**: Has full browser permissions ✅
- **System Agent**: Can be configured for full system access ⚠️
- **Hybrid Agent**: Combines both (requires implementation)

The browser agent currently has **full browser permissions** but **no system-level access**. System permissions can be added but require careful security configuration.

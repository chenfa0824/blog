1、linux查看相关资源的命令

在 Linux 系统中，查看系统资源情况的命令非常丰富从概览到特定资源的详细监控都有相应的工具。下面我将这些命令分门别类地进行介绍，从最常用到更高级的工具。

### 一、全能型概览工具（最常用）

这类命令可以一次性查看多种系统资源（CPU、内存、负载、进程等），是快速了解系统整体状况的首选。

#### 1. `top` - 经典的动态进程查看器
这是几乎所有 Linux 系统都预装的工具，提供系统资源的实时动态视图。

**功能：**
*   **系统概要：** 顶部几行显示系统运行时间、登录用户数、系统平均负载（load average）、CPU 总体使用率、物理内存和交换空间的使用情况。
*   **进程列表：** 下方以动态更新的方式显示进程列表，包括 PID、用户、CPU 占用率、内存占用率、命令等。

**常用交互命令（在 `top` 运行后按）：**
*   `P`：按 CPU 使用率排序
*   `M`：按内存使用率排序
*   `N`：按 PID 排序
*   `k`：终止指定 PID 的进程
*   `1`：展开显示所有 CPU 核心的单独使用率
*   `q`：退出

**示例：**
```bash
top
```

#### 2. `htop` - `top` 的增强版（推荐安装）
`htop` 是 `top` 的一个更现代化、更易用的替代品。它通常需要手动安装，但提供了更好的用户体验。

**优点：**
*   支持鼠标操作。
*   可视化显示 CPU 和内存使用情况条。
*   可以横向或纵向滚动，查看完整的命令行和所有进程。
*   更容易地杀死进程或调整进程的优先级（`nice` 值）。

**安装：**
```bash
# Ubuntu/Debian
sudo apt install htop

# CentOS/RHEL/Fedora
sudo yum install htop      # CentOS/RHEL
sudo dnf install htop      # Fedora
```

**示例：**
```bash
htop
```

---

### 二、特定资源查看工具

这类命令用于查看特定资源的详细信息。

#### 1. 内存查看：`free`
用于显示物理内存和交换空间（swap）的使用情况。

**常用选项：**
*   `-h`：以人类易读的单位（G, M）显示（**最常用**）
*   `-s <秒数>`：持续输出，每间隔指定秒数刷新一次
*   `-t`：在输出中显示总计行

**关键指标：**
*   `available`：估算的可用内存（比 `free` 更准确，因为系统会利用部分内存做缓存）。

**示例：**
```bash
free -h
```
输出类似：
```
              total        used        free      shared  buff/cache   available
Mem:           7.7Gi       2.1Gi       3.4Gi       123Mi       2.2Gi       5.2Gi
Swap:          2.0Gi       0B          2.0Gi
```

#### 2. 磁盘I/O查看：`iostat` 和 `iotop`
*   **`iostat`** (来自 `sysstat` 包)：用于报告 CPU 统计信息和设备、分区的输入/输出统计信息。
    ```bash
    # 安装 sysstat
    sudo apt install sysstat  # Ubuntu/Debian
    sudo yum install sysstat  # CentOS/RHEL

    # 查看所有设备磁盘IO情况，每秒刷新一次
    iostat -xz 1
    ```
*   **`iotop`**：类似于 `top`，但专门用于实时监控磁盘 I/O 活动，显示哪些进程正在频繁读写磁盘。
    ```bash
    sudo iotop  # 需要 root 权限
    ```

#### 3. 网络状态查看：`netstat` 和 `ss`
*   **`netstat`**：一个传统的网络统计工具（逐渐被 `ss` 取代）。
    ```bash
    # 查看所有监听端口
    netstat -tulnp
    # 查看当前网络连接
    netstat -an
    ```
*   **`ss`**：`netstat` 的现代替代品，更快更高效。**推荐使用**。
    ```bash
    # 查看所有监听端口 (类似 netstat -tulnp)
    ss -tuln
    # 显示所有已建立的 TCP 连接
    ss -t
    ```

#### 4. 磁盘空间查看：`df` 和 `du`
*   **`df`**：报告文件系统磁盘空间的使用情况。
    ```bash
    df -h  # 以易读方式显示所有已挂载文件系统的磁盘使用情况
    ```
*   **`du`**：估算文件或目录的磁盘使用量。
    ```bash
    du -sh /path/to/directory  # 摘要显示目录的总大小
    du -sh *                   # 显示当前目录下所有文件和目录的大小
    ```

---

### 三、系统监控与性能分析工具

这些是更强大的工具，常用于性能分析和深度排查。

#### 1. `vmstat` - 虚拟内存统计
报告关于进程、内存、分页、块 IO、陷阱（中断）和 CPU 活动的信息。它可以提供一个快照，也可以持续输出。

**示例：**
```bash
# 每2秒输出一次报告
vmstat 2
```

#### 2. `nmon` - Nigel's Performance Monitor
一个非常强大的交互式性能监控工具，可以同时监控 CPU、内存、磁盘、网络、文件系统、顶级进程等。它也有一个模式可以将数据捕获到 CSV 文件中，用于后续分析。

**安装：**
```bash
# Ubuntu/Debian
sudo apt install nmon
# CentOS/RHEL
sudo yum install nmon
```

**示例：**
```bash
nmon  # 进入交互式界面，然后按相应字母键（如 c for CPU, m for Memory）查看不同资源
```

#### 3. `dstat` - 全能系统资源统计工具
结合了 `vmstat`、`iostat`、`ifstat` 等多种工具的功能，可以直观地同时查看 CPU、磁盘、网络、中断、上下文切换等各种资源。

**安装：**
```bash
# Ubuntu/Debian
sudo apt install dstat
# CentOS/RHEL
sudo yum install dstat
```

**示例：**
```bash
dstat -cdngy  # 同时查看CPU、磁盘、网络、分页、系统状态
```

### 总结与建议

| 场景                     | 推荐命令                     |
| :----------------------- | :--------------------------- |
| **快速查看系统整体状况** | `top`, `htop` (首选)         |
| **查看内存使用情况**     | `free -h`                    |
| **查看磁盘空间**         | `df -h`                      |
| **查看目录大小**         | `du -sh`                     |
| **查看磁盘 I/O**         | `iostat -xz 1`, `sudo iotop` |
| **查看网络连接/端口**    | `ss -tuln`                   |
| **综合性能排查**         | `vmstat 2`, `dstat`          |

对于日常使用，熟练掌握 **`htop`**、**`free -h`** 和 **`df -h`** 就已经能应对大部分查看系统资源的需求了。在需要更深入分析时，再使用 `iostat`, `vmstat`, `dstat` 等专业工具。
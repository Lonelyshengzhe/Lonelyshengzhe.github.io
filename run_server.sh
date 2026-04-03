#!/bin/bash

# 手动添加 Ruby 路径
# export PATH="/mnt/f/Ruby33-x64/bin:$PATH"

# 避免老版 Sass 在非 UTF-8 locale 下触发编码错误
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

# 运行 Jekyll 服务器
bundle exec jekyll serve

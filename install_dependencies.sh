#!/bin/bash

# Exit script if any command fails
set -e

# Update package list and upgrade system
echo "Updating package list and upgrading system..."
sudo apt-get update && sudo apt-get upgrade -y

# Install essential packages
echo "Installing essential packages..."
sudo apt-get install -y build-essential dkms curl ca-certificates gnupg lsb-release

# Install NVIDIA drivers
echo "Installing NVIDIA drivers..."
sudo apt-get install -y nvidia-driver-535

# Install Docker
echo "Installing Docker..."

# Remove old versions if any
sudo apt-get remove -y docker docker.io containerd runc

# Install Docker dependencies
sudo apt-get install -y ca-certificates gnupg

# Add Docker's official GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
sudo rm -f /etc/apt/keyrings/docker.gpg  # Remove if it exists
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) \
  signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker packages
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
    docker-buildx-plugin docker-compose-plugin

# Install NVIDIA Container Toolkit
echo "Installing NVIDIA Container Toolkit..."
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
sudo apt-get install -y curl
curl -s -L https://nvidia.github.io/libnvidia-container/gpgkey | \
    sudo gpg --dearmor --yes -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg

curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit

# Configure NVIDIA Container Toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Add the current user to the Docker group
sudo usermod -aG docker $USER

# Verify NVIDIA Docker installation
echo "Verifying NVIDIA Docker installation..."
sudo docker run --rm --gpus all vllm/vllm-openai:v0.6.2

# Prompt the user to reboot
echo "Installation complete! Please reboot your system to apply all changes."

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "mlord"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "container_port" {
  description = "Container port"
  type        = number
  default     = 3000
}

variable "container_cpu" {
  description = "Container CPU units (1024 = 1 vCPU)"
  type        = number
  default     = 512
}

variable "container_memory" {
  description = "Container memory in MB"
  type        = number
  default     = 1024
}

variable "desired_count" {
  description = "Desired number of tasks"
  type        = number
  default     = 1
}

variable "min_capacity" {
  description = "Minimum number of tasks for auto-scaling"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of tasks for auto-scaling"
  type        = number
  default     = 4
}

variable "database_url" {
  description = "PostgreSQL database URL (Neon)"
  type        = string
  sensitive   = true
}

variable "domain_name" {
  description = "Domain name for the application (e.g., app.mlord.ai)"
  type        = string
  default     = ""
}

variable "use_route53" {
  description = "Whether to use Route 53 for DNS validation (set to false if using external DNS)"
  type        = bool
  default     = false
}

variable "route53_zone_id" {
  description = "Route 53 hosted zone ID (required if use_route53 is true)"
  type        = string
  default     = ""
}

# Frontend-specific variables
variable "frontend_container_port" {
  description = "Frontend container port (Nginx)"
  type        = number
  default     = 80
}

variable "frontend_container_cpu" {
  description = "Frontend container CPU units (256 = 0.25 vCPU)"
  type        = number
  default     = 256
}

variable "frontend_container_memory" {
  description = "Frontend container memory in MB"
  type        = number
  default     = 512
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 2
}

variable "frontend_min_capacity" {
  description = "Minimum number of frontend tasks for auto-scaling"
  type        = number
  default     = 2
}

variable "frontend_max_capacity" {
  description = "Maximum number of frontend tasks for auto-scaling"
  type        = number
  default     = 6
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_url" {
  description = "URL of the Application Load Balancer"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"
}

output "certificate_arn" {
  description = "ARN of the ACM certificate (if domain is configured)"
  value       = var.domain_name != "" ? aws_acm_certificate.main[0].arn : null
}

output "certificate_validation_records" {
  description = "DNS records needed for certificate validation (if not using Route 53)"
  value = var.domain_name != "" && !var.use_route53 ? {
    for dvo in aws_acm_certificate.main[0].domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      type   = dvo.resource_record_type
      value  = dvo.resource_record_value
    }
  } : null
}

output "ecr_repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.app.name
}

output "cloudwatch_log_group" {
  description = "Name of the CloudWatch log group"
  value       = aws_cloudwatch_log_group.ecs.name
}

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "private_subnet_id" {
  description = "ID of the private subnet"
  value       = aws_subnet.private.id
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

# Frontend outputs
output "frontend_ecr_repository_url" {
  description = "URL of the frontend ECR repository"
  value       = aws_ecr_repository.frontend.repository_url
}

output "frontend_service_name" {
  description = "Name of the frontend ECS service"
  value       = aws_ecs_service.frontend.name
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

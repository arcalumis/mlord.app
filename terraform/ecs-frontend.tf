# Frontend ECS Task Definition
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-${var.environment}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = var.frontend_container_cpu
  memory                   = var.frontend_container_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name      = "${var.project_name}-frontend"
      image     = "${aws_ecr_repository.frontend.repository_url}:latest"
      essential = true

      portMappings = [
        {
          containerPort = var.frontend_container_port
          protocol      = "tcp"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://localhost:${var.frontend_container_port}/health || exit 1"]
        interval    = 30
        timeout     = 3
        retries     = 3
        startPeriod = 5
      }
    }
  ])

  tags = {
    Name = "${var.project_name}-${var.environment}-frontend-task"
  }
}

# Frontend ECS Service
resource "aws_ecs_service" "frontend" {
  name            = "${var.project_name}-${var.environment}-frontend-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.private.id]
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "${var.project_name}-frontend"
    container_port   = var.frontend_container_port
  }

  deployment_maximum_percent         = 200
  deployment_minimum_healthy_percent = 100

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  health_check_grace_period_seconds = 30

  enable_execute_command = true

  tags = {
    Name = "${var.project_name}-${var.environment}-frontend-service"
  }

  depends_on = [
    aws_lb_listener.http,
    aws_iam_role_policy.ecs_task_logs
  ]

  lifecycle {
    ignore_changes = [desired_count, task_definition]
  }
}

terraform {
  required_providers {
    render = {
      source  = "render-oss/render"
      version = "~> 1.3"
    }
  }
}

provider "render" {
  api_key  = var.render_api_key
  owner_id = var.render_owner_id
}

resource "render_web_service" "insurebot_api" {
  name   = "insurebot-api"
  region = "oregon"
  plan   = "free"

  runtime_source = {
    native_runtime = {
      auto_deploy_trigger = "commit"
      branch              = "main"
      build_command       = "pip install -r backend/requirements.txt"
      repo_url            = var.github_repo_url
      runtime             = "python"
    }
  }

  start_command = "uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT"

  env_vars = {
    GROQ_API_KEY = { value = var.groq_api_key }
    ENVIRONMENT  = { value = "production" }
  }
}

output "api_url" {
  value = render_web_service.insurebot_api.url
}

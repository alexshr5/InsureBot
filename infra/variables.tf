variable "render_api_key" {
  description = "Render.com API key"
  type        = string
  sensitive   = true
}

variable "render_owner_id" {
  description = "Render.com owner ID"
  type        = string
}

variable "groq_api_key" {
  description = "Groq API key for LLM"
  type        = string
  sensitive   = true
}

variable "github_repo_url" {
  description = "GitHub repository URL"
  type        = string
}

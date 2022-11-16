terraform {

  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.3.3"

}

provider "aws" {
  region = var.aws_region
  profile = var.aws_profile
}

locals {
  mime_type_mappings = {
      html = "text/html",
      js   = "text/javascript",
      css  = "text/css"
      txt  = "text/plain"
      ico  = "image/x-icon"
  }
  angular_dist = "../../dist/club-events-ui"
}

resource "aws_s3_object" "club-events-ui-objects" {
  for_each = fileset("${local.angular_dist}", "*")
	key    = each.value
	source = "${local.angular_dist}/${each.value}"
	bucket = "club-events-front-end"

  etag         = filemd5("${local.angular_dist}/${each.value}")

	content_type = local.mime_type_mappings[concat(regexall("\\.([^\\.]*)$", each.value), [[""]])[0][0]]
}


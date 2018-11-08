Rails.application.configure do
  # Settings specified here will take precedence over those in
  # config/application.rb.
  config.cache_classes = true
  config.eager_load    = true

  # Don't show full error reports.
  config.consider_all_requests_local = false

  # Enable/disable caching. By default caching is disabled.
  config.action_controller.perform_caching = true
  config.cache_store = :memory_store

  # Print deprecation notices to the Rails logger.
  config.active_support.deprecation = :log

  # Raise an error on page load if there are pending migrations.
  config.active_record.migration_error = :page_load

  # Debug mode disables concatenation and preprocessing of assets.
  # This option may cause significant delays in view rendering with a large
  # number of complex assets.
  config.assets.debug = true

  # Suppress logger output for asset requests.
  config.assets.quiet = true

  # Raises error for missing translations
  config.action_view.raise_on_missing_translations = true

  # Logging configuration that goes to STDOUT.
  config.logger          = ActiveSupport::Logger.new(STDOUT)
  config.lograge.enabled = true

  config.after_initialize do
    ActiveRecord::Base.logger = Rails.logger.clone
    ActiveRecord::Base.logger.level = Logger::INFO
  end
end

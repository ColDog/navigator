source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end


gem 'rails',          '5.1.6'
gem 'sqlite3',        '1.3.13'
gem 'puma',           '3.12.0'
gem 'uglifier',       '4.1.19'
gem 'dry-validation', github: 'dry-rb/dry-validation'
gem 'tzinfo-data',    '1.2018.5'

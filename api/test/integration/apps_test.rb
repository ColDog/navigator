require 'test_helper'

class AppsTest < ActionDispatch::IntegrationTest

  test "crud an app" do
    post '/api/v1/apps', params: JSON.parse(file_fixture('app.json').read)
    assert_response :created

    get '/api/v1/apps/test'
    assert_response :ok

    delete '/api/v1/apps/test'
    assert_response :created
  end

  test "release a build" do
    post '/api/v1/apps', params: JSON.parse(file_fixture('app.json').read)
    assert_response :created

    post '/api/v1/apps/test/review/builds', params: { version: 'v1' }
    assert_response :created

    post '/api/v1/apps/test/review/release?version=v1'
    assert_response :created

    post '/api/v1/apps/test/review/promote?version=v1&to=staging'
    assert_response :created

    post '/api/v1/apps/test/staging/release?version=v1'
    assert_response :created

    delete '/api/v1/apps/test/review/release?version=v1'
    assert_response :created

    get '/api/v1/apps/test'
    assert_response :ok
    puts JSON.pretty_generate(JSON.parse(response.body))
  end

end

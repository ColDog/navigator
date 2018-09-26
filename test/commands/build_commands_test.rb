require 'test_helper'

class BuildCommandsTest < ActiveSupport::TestCase

  test "create a build" do
    cmd = Builds::CreateCommand.new(
      name: 'one',
      version: 'v1',
      values: {
        image: { repository: 'nginx', tag: 'asdfasdf' },
      },
      stage: 'review',
    )

    assert cmd.execute
    assert_not_nil Build.find_by(app_id: apps(:one).id)
  end

end

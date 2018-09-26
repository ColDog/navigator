require 'test_helper'

class ReleaseCommandsTest < ActiveSupport::TestCase

  test "create a release" do
    cmd = Releases::CreateCommand.new(
      build_id: builds(:one).id,
    )

    assert cmd.execute
    assert_not_nil Release.find_by(build_id: builds(:one).id)
  end

end

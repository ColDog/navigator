require 'test_helper'

class ReleaseCommandsTest < ActiveSupport::TestCase

  test "create a release" do
    Releases::CreateCommand.execute(
      build_uid: builds(:one).uid,
    )
    assert_not_nil Release.find_by(build_id: builds(:one).id)
  end

  test "deploy a release" do
    Releases::DeployCommand.execute(
      release_uid: releases(:one).uid,
      cluster_uid: clusters(:one).uid,
    )
  end

end

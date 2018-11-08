class ReleaseLog < ActiveRecord::Base
  def self.log(release_uid, line)
    create!(release_uid: release_uid, line: line)
  end
end

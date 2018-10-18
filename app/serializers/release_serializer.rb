class ReleaseSerializer < ApplicationSerializer
  fields :id, :status

  def id
    model.uid
  end

end

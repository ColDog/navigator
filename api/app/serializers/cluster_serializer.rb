class ClusterSerializer < ApplicationSerializer
  fields :id, :name, :values

  def id
    model.uid
  end

end

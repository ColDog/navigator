class AppSerializer < ApplicationSerializer
  fields :name, :id, :stages

  def id
    model.uid
  end

  def stages
    model.stages.map { |stage| StageSerializer.serialize(stage) }
  end

end

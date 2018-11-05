class AppSerializer < ApplicationSerializer
  fields :name, :id, :stages, :manifest

  def id
    model.uid
  end

  def stages
    model.stages.map { |stage| StageSerializer.serialize(stage) }
  end

  def manifest
    AppClient.manifest(model)
  end

end

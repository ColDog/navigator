class BuildSerializer < ApplicationSerializer
  fields :id, :version, :values, :number, :promoted, :removed, :released,
         :release, :app

  def id
    model.uid
  end

  def removed
    model.removed?
  end

  def released
    model.released?
  end

  def app
    { name: model.app.name, id: model.app.uid }
  end

  def release
    ReleaseSerializer.serialize(model.release)
  end

end

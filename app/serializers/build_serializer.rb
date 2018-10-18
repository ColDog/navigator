class BuildSerializer < ApplicationSerializer
  fields :id, :version, :values, :number, :promoted, :removed, :released,
         :release

  def id
    model.uid
  end

  def removed
    model.removed?
  end

  def released
    model.released?
  end

  def release
    ReleaseSerializer.serialize(model.release)
  end

end

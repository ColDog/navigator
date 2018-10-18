class StageSerializer < ApplicationSerializer
  fields :name, :id, :review, :auto, :promotion, :current, :released, :previous,
         :clusters, :builds

  def id
    model.uid
  end

  def current
    BuildSerializer.serialize(model.current)
  end

  def released
    BuildSerializer.serialize(model.released)
  end

  def previous
    BuildSerializer.serialize(model.previous)
  end

  def clusters
    model.clusters.map { |cluster| ClusterSerializer.serialize(cluster) }
  end

  def builds
    model.builds.last(50).map { |build| BuildSerializer.serialize(build) }
  end

end
